(function ($) {

    $.fn.contextMenu = function (options) {
        const settings = $.extend({
            menuItems: [
                { label: "非台灣用語", action: "action1" },
                { label: "非教育部名詞", action: "action2" },
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
            onItemSelect: (action, markedText) => {
                const baseUri = 'http://sys-ai-mark-api.la.succ.work';
                const uri = `${baseUri}/openapi/v1/mark`;
                const data = {
                    action,
                    text: markedText
                };
                fetch(uri, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            },
        }, options);

        const $menu = $('<div class="custom-context-menu"></div>').css(settings.menuStyle).hide();
        $('body').append($menu);

        $.each(settings.menuItems, function (index, item) {
            const $menuItem = $('<div class="menu-item"></div>').text(item.label).css(settings.itemStyle);

            $menuItem.on("click", function () {
                const markedText = $menu.data("markedText");
                settings.onItemSelect(item.action, markedText);
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
                    const markedText = $mark.text();
                    $menu.data("markedText", markedText);

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