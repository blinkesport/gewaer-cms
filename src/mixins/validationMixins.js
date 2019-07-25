export default {
    methods: {
        $_focusOnError() {
            const errorItems = this.$validator.errors.items;
            const FIXED_HEADER_HEIGHT = 100;
            const firstErrorField = errorItems[0].field;
            const element = document.querySelector(`[data-vv-name=${firstErrorField}]`);
            element.scrollIntoView();
            element.focus();
            window.scroll(0, window.scrollY - FIXED_HEADER_HEIGHT);
        }
    }
}
