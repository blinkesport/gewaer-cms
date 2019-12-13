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
                ],
                [
                    {
                        image: function() {
                            // let fileInput = this.container.querySelector("input.ql-image[type=file]");
                            // console.log(fileInput);
                            // if (fileInput == null) {
                            //     fileInput = document.createElement("input");
                            //     fileInput.setAttribute("type", "file");
                            //     fileInput.setAttribute(
                            //         "accept",
                            //         "image/png"
                            //     );
                            //     fileInput.classList.add("ql-image");
                            //     fileInput.addEventListener("change", () => {
                            //         if (fileInput.files != null && fileInput.files[0] != null) {
                            //             // Do your own stuff here
                            //             alert("test");
                            //             debugger;
                            //         }
                            //     });
                            //     this.container.appendChild(fileInput);
                            // }
                            // fileInput.click();
                        }
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

            // this.quill = new Quill(`#${this.editorId}`, {
            //     modules: {
            //         toolbar: {
            //             handlers: {
            //                 image: this.imageHandler
            //             }
            //         }
            //     },
            //     theme: "snow"
            // });
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

            const toolbar = this.quill.getModule("toolbar");
            toolbar.addHandler("image", this.imageHandler);

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
        },
        imageHandler() {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = async() => {
                console.log(this);
                const file = input.files[0];
                console.log("User trying to uplaod this:", file);

                // const id = await uploadFile(file); // I'm using react, so whatever upload function
                const range = this.quill.getSelection();
                console.log("Range: ", range);
                // const link = `127.0.0.1:8080/file/${id}`;

                // console.log(file);
                // axios.post("/filesystem", {
                //     name: file.name,
                //     type: file.type,
                //     files: input.files
                // }).then((response) => {
                //     console.log(response);
                // }).catch((error) => {
                //     debugger;
                // });

                // this part the image is inserted
                // by 'image' option below, you just have to put src(link) of img here.
                this.quill.container.insertEmbed(range.index, "image", link);
            }
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
