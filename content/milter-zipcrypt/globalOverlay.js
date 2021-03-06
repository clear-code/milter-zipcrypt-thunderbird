var MilterZipcrypt = {
    gHeaderTable : null,

    _getSelectItemIndex: function(itemData) {
        if (this.gHeaderTable == null) {
            this.gHeaderTable = new Object();
            let selectElem = document.getElementById("addressCol1#1");
            for (let i = 0; i < selectElem.childNodes[0].childNodes.length; i ++) {
                let aData = selectElem.childNodes[0].childNodes[i].getAttribute("label");
                this.gHeaderTable[aData] = i;
            }
        }

        return this.gHeaderTable[itemData];
    },

    appendRequestHeader : function() {
        let listbox = document.getElementById('addressingWidget');
        let templateNode = listbox.getElementsByTagName("listitem")[0];

        let newNode = templateNode.cloneNode(true);
        newNode.id = "X-Milter-Zipcrypt-Request-Header";
        newNode.hidden = true;
        listbox.appendChild(newNode);

        let input = newNode.getElementsByTagName(awInputElementName());
        let select = newNode.getElementsByTagName(awSelectElementName());

        top.MAX_RECIPIENTS++;

        input[0].setAttribute("value", "Yes");
        input[0].value = "Yes";

        select[0].selectedItem = select[0].childNodes[0].childNodes[this._getSelectItemIndex("X-Milter-Zipcrypt-Request:")];

        awSetInputAndPopupId(input[0], select[0], top.MAX_RECIPIENTS);
    },

    getRequestHeader : function() {
        return document.getElementById('X-Milter-Zipcrypt-Request-Header');
    },

    removeRequestHeader: function() {
        let header = this.getRequestHeader();

        if (header) {
            let listbox = document.getElementById('addressingWidget');
            listbox.removeChild(header);
            top.MAX_RECIPIENTS--;
        }
    },

    toggleRequestHeader : function() {
        let header = this.getRequestHeader();

        if (header)
            this.removeRequestHeader();
        else
            this.appendRequestHeader();
    },

    init : function() {
        window.removeEventListener('DOMContentLoaded', this, false);
        let button = document.getElementById('milter-zipcrypt-request-button');
        button.checked = false;
    },

    handleEvent : function(aEvent) {
        switch (aEvent.type)
        {
        case 'DOMContentLoaded':
            this.init();
            break;
        }
    }
};

window.addEventListener('DOMContentLoaded', MilterZipcrypt, false);

// vim: ts=4:expandtab:sw=4:sts=4
