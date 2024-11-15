(function ($) {
    $.fn.highlightSelection = function (options) {
        const calculateRangeOffsets = (element, range) => {
            let offset = 0, startOffset = 0;
            const selectionLength = range.toString().length;

            $(element).contents().each(function () {
                if (this === range.startContainer) {
                    startOffset = offset + range.startOffset;
                    return false;
                }

                if (this.nodeType === Node.TEXT_NODE) {
                    offset += this.textContent.length;
                }

                if (this.nodeType === Node.ELEMENT_NODE && this.tagName === 'MARK') {
                    offset += $(this).text().length;
                }
            });

            return { start: startOffset, length: selectionLength };
        };

        const highlightSelectedText = (element) => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = selection.toString().trim();

                if (selectedText) {
                    const adjustedRange = calculateRangeOffsets(element, range);
                    $(element).markRanges([adjustedRange], options);
                    selection.removeAllRanges();
                }
            }
        };

        return this.on("mouseup", function (event) {
            highlightSelectedText(event.target);
        });
    };

})(jQuery);