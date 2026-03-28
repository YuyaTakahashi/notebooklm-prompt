// テキストをNotebookLMに注入する共通関数
function insertPrompt(text) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: (injectedText) => {
        const activeEl = document.activeElement;
        let target = (activeEl?.tagName === 'TEXTAREA' || activeEl?.isContentEditable) 
                     ? activeEl 
                     : document.querySelector('textarea') || document.querySelector('[contenteditable="true"]');

        if (!target) {
          navigator.clipboard.writeText(injectedText);
          alert("入力欄が見つかりません。クリップボードにコピーしました。");
          return;
        }

        if (target.isContentEditable) {
          target.innerText = injectedText;
        } else {
          target.value = injectedText;
        }
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.focus();
      },
      args: [text]
    }, () => {
      const status = document.getElementById('status');
      status.style.display = 'block';
      setTimeout(() => { status.style.display = 'none'; }, 1500);
    });
  });
}