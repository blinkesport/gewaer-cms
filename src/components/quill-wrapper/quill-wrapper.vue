<template>
    <div>
        <div
            :name="$attrs.name"
            :id="editorId"
        />
    </div>
</template>

<script>

import Quill from "quill";

export default {
    name: "QuillWrapper",
    props: {
        value: {
            type: null,
            required: true
        }
    },
    $_veeValidate: {
        name() {
            return this.$attrs.name;
        },
        value() {
            return this.value;
        }
    },
    data() {
        return {
            defaultToolbarConfigurations: [
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ "header": 1 }, { "header": 2 }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ "script": "sub" }, { "script": "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ "direction": "rtl" }], // text direction
                [{ size: ["small", false, "large", "huge"] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                [
                    {
                        lineheight: [
                            "1.0",
                            "1.5",
                            "2.0",
                            "2.5",
                            "3.0"
                        ]
                    }
                ]
            ],
            editorId: Math.random().toString(16).replace("0.", "q"),
            quill: null
        }
    },
    mounted() {
        this.initializeQuill();
    },
    methods: {
        initializeQuill() {
            this.lineHeightSetup();

            this.quill = new Quill(`#${this.editorId}`, {
                modules: {
                    toolbar: this.defaultToolbarConfigurations
                },
                theme: "snow"
            });

            this.setHtml(this.value);

            this.quill.on("text-change", (delta, oldDelta, source) => {
                if (source === "user") {
                    const textHTML = this.getHtml();

                    if (!this.hasInnerText(textHTML)) {
                        this.$emit("input", "");
                        return;
                    }
                    this.$emit("input", textHTML);
                }
            });

        },
        lineHeightSetup() {
            const Parchment = Quill.import("parchment");
            const lineHeightConfig = {
                scope: Parchment.Scope.INLINE,
                whitelist: [
                    "1.0",
                    "1.5",
                    "2.0",
                    "2.5",
                    "3.0"
                ]
            };
            const lineHeightClass = new Parchment.Attributor.Class(
                "lineheight",
                "ql-line-height",
                lineHeightConfig
            );
            const lineHeightStyle = new Parchment.Attributor.Style(
                "lineheight",
                "line-height",
                lineHeightConfig
            );
            Parchment.register(lineHeightClass);
            Parchment.register(lineHeightStyle);
        },
        getHtml() {
            return this.quill.container.firstChild.innerHTML;
        },
        setHtml(data) {
            this.quill.container.firstChild.innerHTML = data;
        },
        hasInnerText(html) {
            const element = document.createElement("div");
            element.innerHTML = html;
            return element.innerText;
        }
    }
}
</script>

<style>
.ql-editor {
    min-height: 100px;
    max-height: 400px;
    color: black;
}

.ql-toolbar, .ql-container {
    border: 1px solid #e8e8e8 !important;
}
.ql-snow .ql-picker.ql-lineheight {
    width: 58px;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.0"]::before {
    content: "1.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="1.0"]::before {
    content: "1.0" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.5"]::before {
    content: "1.5";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="1.5"]::before {
    content: "1.5" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2.0"]::before {
    content: "2.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="2.0"]::before {
    content: "2.0" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2.5"]::before {
    content: "2.5";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="2.5"]::before {
    content: "2.5" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="3.0"]::before {
    content: "3.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="3.0"]::before {
    content: "3.0" !important;
}
</style>
