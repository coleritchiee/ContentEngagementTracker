(async () => {
    const src = chrome.extension.getURL('content_script.js');
    const contentScript = await import(src);
    contentScript.main();
  })();