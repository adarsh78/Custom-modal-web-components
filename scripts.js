class Modal extends HTMLElement {
  constructor() {
    super();
  }

  get visible() {
    return this.hasAttribute("visible");
  }

  set visible(value) {
    if (value) {
      this.setAttribute("visible", "");
    } else {
      this.removeAttribute("visible");
    }
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(value) {
    this.setAttribute("title", value);
  }

  connectedCallback() {
    this._render();
    this._attachEventHandlers();
  }
  _attachEventHandlers() {
    const cancelButton = this.shadowRoot.querySelector(".cancel");
    cancelButton.addEventListener("click", (e) => {
      this.dispatchEvent(new CustomEvent("cancel"));
      this.removeAttribute("visible");
    });
    const okButton = this.shadowRoot.querySelector(".ok");
    okButton.addEventListener("click", (e) => {
      this.dispatchEvent(new CustomEvent("ok"));
      this.removeAttribute("visible");
    });
  }

  static get observedAttributes() {
    return ["visible", "title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && this.shadowRoot) {
      this.shadowRoot.querySelector(".title").textContent = newValue;
    }
    if (name === "visible" && this.shadowRoot) {
      if (newValue === null) {
        this.shadowRoot.querySelector(".wrapper").classList.remove("visible");
      } else {
        this.shadowRoot.querySelector(".wrapper").classList.add("visible");
      }
    }
  }

  _render() {
    const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
    const container = document.createElement("div");
    container.innerHTML = `
            <style>
              .wrapper {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: gray;
                opacity: 0;
                visibility: hidden;
                transform: scale(1.1);
                transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
                z-index: 1;
              }
              .visible {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
                transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
              }
              .modal {
                font-family: Helvetica;
                font-size: 14px;
                padding: 10px 10px 5px 10px;
                background-color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                border-radius: 5px;
                min-width: 300px;
              }
              .title {
                font-size: 18px;
              }
              .button-container {
                text-align: right;
              }
              button {
                min-width: 80px;
                border-radius: 2px;
                padding: 3px;
                color:white;
                cursor: pointer;
                border: 0;
                outline: 0;

              }
              button:hover {
                background-color: #6c757d;
                border-color: #6c757d;
              }
              button.ok {
              background-color: green;
              }
              button.cancel {
              background-color: red;
              }
            </style>
            <div class='${wrapperClass}'>
              <div class='modal'>
                <span class='title'>Confirmation Pop-Up</span>
                <div class='content'>
                   <slot></slot>
                </div>
                <div class='button-container'>
                  <button class='cancel'>Cancel</button>
                  <button class='ok'>Okay</button>
                </div>
              </div>
            </div>`;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(container);
  }
}
window.customElements.define("x-modal", Modal);
