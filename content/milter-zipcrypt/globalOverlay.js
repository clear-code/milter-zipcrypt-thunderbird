var gHeaderTable = null;

function _getSelectItemIndex(itemData) {
  if (gHeaderTable == null) {
      gHeaderTable = new Object();
      let selectElem = document.getElementById("addressCol1#1");
      for (let i = 0; i < selectElem.childNodes[0].childNodes.length; i ++) {
          let aData = selectElem.childNodes[0].childNodes[i].getAttribute("label");
          gHeaderTable[aData] = i;
      }
  }

  return gHeaderTable[itemData];
}

function appendMilterZipcryptRequestHeader() {
    let listbox = document.getElementById('addressingWidget');
    let templateNode = listbox.getElementsByTagName("listitem")[0];

    let newNode = templateNode.cloneNode(true);
    newNode.id = "X-Milter-Zipcrypt-Request-Header";
    newNode.hidden = true
    listbox.appendChild(newNode);

    let input = newNode.getElementsByTagName(awInputElementName());
    let select = newNode.getElementsByTagName(awSelectElementName());

    top.MAX_RECIPIENTS++;

    input[0].setAttribute("value", "Yes");
    input[0].value = "Yes";

    select[0].selectedItem = select[0].childNodes[0].childNodes[_getSelectItemIndex("X-Milter-Zipcrypt-Request:")];

    awSetInputAndPopupId(input[0], select[0], top.MAX_RECIPIENTS);
}

function getMilterZipcryptRequestHeader() {
    return document.getElementById('X-Milter-Zipcrypt-Request-Header');
}

function removeMilterZipcryptRequestHeader() {
    let header = getMilterZipcryptRequestHeader();

    if (header) {
        let listbox = document.getElementById('addressingWidget');
        listbox.removeChild(header);
        top.MAX_RECIPIENTS--
    }
}

function toggleMilterZipcryptRequestHeader() {
    let header = getMilterZipcryptRequestHeader();

    if (header)
        removeMilterZipcryptRequestHeader();
    else
        appendMilterZipcryptRequestHeader();
}
// vim: ts=4:expandtab:sw=4:sts=4
