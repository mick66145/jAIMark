(function ($) {

    $.fn.contextMenu = function (options) {
        const settings = $.extend({
            menuItems: [
                { label: "非台灣用語", action: "non_taiwanese_terminology" },
                { label: "非教育部名詞", action: "non_moe_terminology" },
            ],
            menuStyle: {
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                position: "absolute",
                zIndex: 1000
            },
            itemStyle: {
                padding: "5px 10px",
                cursor: "pointer"
            },
            onItemSelect: ({ action, actionText, text }) => {
                const baseUri = 'https://api-ai-mark.demo.mouth.team';
                const uri = `${baseUri}/openapi/v1/mark`;
                const data = { action, actionText, text };
                fetch(uri, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        settings.onItemSelectCallback()
                    });
            },
            onItemSelectCallback: () => { },
        }, options);

        const $menu = $('<div class="custom-context-menu"></div>').css(settings.menuStyle).hide();
        $('body').append($menu);

        $.each(settings.menuItems, function (index, item) {
            const $menuItem = $('<div class="menu-item"></div>').text(item.label).css(settings.itemStyle);

            $menuItem.on("click", function () {
                const markedText = $menu.data("markedText");
                settings.onItemSelect({
                    action: item.action,
                    actionText: item.action === 'non_taiwanese_terminology' ? '非台灣用語' : '非教育部名詞',
                    text: markedText
                });
                $menu.hide();
            });

            $menu.append($menuItem);
        });

        $(document).on("click", function () {
            $menu.hide();
        });

        return this.each(function () {
            $(this).on("contextmenu", function (e) {
                const $mark = $(e.target).closest("mark");
                if ($mark.length > 0) {
                    e.preventDefault();

                    const getMarkedText = (mark) => {
                        let mergedText = "";
                        const visitedMarks = new Set();
                        const mergeMarks = ($current, negative = 'next') => {
                            if ($current.length > 0 && $current.prop("nodeName") === "MARK" && !visitedMarks.has($current[0])) {

                                visitedMarks.add($current[0]);

                                if (negative === 'next') {
                                    mergedText += $current.text();
                                } else {
                                    mergedText = $current.text() + mergedText;
                                }

                                // 向前檢查
                                const prev = $current[0].previousSibling;
                                if (prev && prev.textContent === "" && prev.previousSibling?.nodeType === 1 && prev.previousSibling?.nodeName === "MARK") {
                                    mergeMarks($(prev.previousSibling), 'prev');
                                }

                                // 向後檢查
                                const next = $current[0].nextSibling;
                                if (next && next.textContent === "" && next.nextSibling?.nodeType === 1 && next.nextSibling?.nodeName === "MARK") {
                                    mergeMarks($(next.nextSibling), 'next');
                                }
                            }
                        }

                        mergeMarks(mark);
                        return mergedText;
                    }
                    $menu.data("markedText", getMarkedText($mark).trim());

                    const menuWidth = $menu.outerWidth();
                    const menuHeight = $menu.outerHeight();
                    let posX = e.pageX;
                    let posY = e.pageY;

                    if (posX + menuWidth > $(window).width()) {
                        posX -= menuWidth;
                    }
                    if (posY + menuHeight > $(window).height()) {
                        posY -= menuHeight;
                    }

                    $menu.css({ top: posY + "px", left: posX + "px" }).show();
                } else {
                    $menu.hide();
                }
            });
        });
    };

})(jQuery);