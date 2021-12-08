'use strict';

const snakeToCamel = (s) =>
    s.replace(/(-\w)/g, (m) => m[1].toUpperCase());

const loadScriptAsync = (src) =>
    new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = src;
      tag.async = true;
      tag.type = "text/javascript";
      tag.onload = () => {
        resolve();
      };
      tag.crossorogin = true;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });


window.reactRegistry = (function() {
  const apps = {};

  function _throwInitializationError() {
    throw new Error('React app factory method must either return an object ' +
        'with a renderComponent function or the renderComponent function itself');
  }

  function _render(appName, container, id, input, externalEvents, publicPath) {
    if (input === undefined) {
      input = {};
    }

    const app = apps[appName](id, input, externalEvents, publicPath);

    if (app.component) {
      var methods = app.methods || {};
      ReactDOM.render(app.component, container);
      return methods;
    }
  }

  function _register(id, constructorFn) {
    apps[id] = constructorFn;
  }

  return {
    render: _render,
    register: _register
  };
})();


const transformObjectValue = (val) => {
  try {
    return JSON.parse(val);

  } catch (e) {
      return val;
  }
}

window.toccoWidgets = (async () => {
  const version = document.currentScript.getAttribute('data-nice-version');


  await loadScriptAsync('https://unpkg.com/react@16.13.1/umd/react.production.min.js');
  await loadScriptAsync('https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js');

  const widgetContainerNodeList = document.querySelectorAll('[data-tocco-widget]');
  const widgetContainers = Array.prototype.slice.call(widgetContainerNodeList);
  const apps = [...new Set(widgetContainers.map(container => container.getAttribute("data-tocco-widget")))];


  await Promise.all(apps.map(app => {
    return loadScriptAsync(`http://localhost:8080/js/tocco-${app}/dist/index.js`);
  }));

  widgetContainers.forEach(container => {
    const app = container.getAttribute("data-tocco-widget");
    const attributes = Array.prototype.slice.call(container.attributes);


    const input = attributes.reduce((acc, val) => ({
      ...acc,
      [snakeToCamel(val.name.replace('data-', ''))]: transformObjectValue(val.value)
    }), {});

    console.log('i>nput', JSON.stringify(input))

    window.reactRegistry.render(
        app,
        container,
        '',
        input,
        {},
        `http://localhost:8080/js/tocco-${app}/dist/`)
  });
})();



