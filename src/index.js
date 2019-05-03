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

  function _render(app, container, id, input, externalEvents, publicPath) {
    if (input === undefined) {
      input = {};
    }

    input = {...input, customTheme: {colors: {primary: 'yellow'}}};
    const component = apps[app](id, input, externalEvents, publicPath);

    let type;
    let methods;

    if (typeof component === 'function') {
      type = component;
      methods = {};
    } else if (typeof component === 'object') {
      if (typeof component.renderComponent !== 'function') {
        _throwInitializationError();
      }
      type = component.renderComponent;
      methods = component.methods || {};
    } else {
      _throwInitializationError();
    }

    const element = React.createElement(type);
    ReactDOM.render(element, container);

    return methods;
  }

  function _register(id, constructorFn) {
    apps[id] = constructorFn;
  }

  return {
    render: _render,
    register: _register
  };
})();



window.toccoWidgets = (async () => {
  const version = document.currentScript.getAttribute('nice-version');

  await loadScriptAsync('https://unpkg.com/react@16/umd/react.production.min.js');
  await loadScriptAsync('https://unpkg.com/react-dom@16/umd/react-dom.production.min.js');

  const widgetContainerNodeList = document.querySelectorAll('[data-tocco-widget]');
  const widgetContainers = Array.prototype.slice.call(widgetContainerNodeList);
  const apps = [...new Set(widgetContainers.map(container => container.getAttribute("data-tocco-widget")))];


  await Promise.all(apps.map(app => {
    return loadScriptAsync(`https://unpkg.com/tocco-${app}@${version}/dist/index.js`);
  }));

  widgetContainers.forEach(container => {

    const app = container.getAttribute("data-tocco-widget");
    const attributes = Array.prototype.slice.call(container.attributes);

    const input = attributes.reduce((acc, val) => ({
      ...acc,
      [snakeToCamel(val.name.replace('data-', ''))]: val.value
    }), {});


    window.reactRegistry.render(
        app,
        container,
        '',
        input,
        {},
        'https://unpkg.com/tocco-' + app + 'r@latest/dist/')
  });
})();



