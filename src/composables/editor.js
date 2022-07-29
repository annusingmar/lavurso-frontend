export function onEditorPaste(event, ref) {
  if (event.target.nodeName === "INPUT") return;
  let text, onPasteStripFormattingIEPaste;
  event.preventDefault();
  event.stopPropagation();
  if (event.originalEvent && event.originalEvent.clipboardData.getData) {
    text = event.originalEvent.clipboardData.getData("text/plain");
    ref.value.runCmd("insertText", text);
  } else if (event.clipboardData && event.clipboardData.getData) {
    text = event.clipboardData.getData("text/plain");
    ref.value.runCmd("insertText", text);
  } else if (window.clipboardData && window.clipboardData.getData) {
    if (!onPasteStripFormattingIEPaste) {
      onPasteStripFormattingIEPaste = true;
      ref.value.runCmd("ms-pasteTextOnly", text);
    }
    onPasteStripFormattingIEPaste = false;
  }
}
