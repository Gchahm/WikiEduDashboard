import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { extend } from 'lodash-es';

const SlideMenu = createReactClass({
  displayName: 'SlideMenu',

  propTypes: {
    closeMenu: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    slides: PropTypes.array,
    currentSlide: PropTypes.object,
    enabledSlides: PropTypes.array,
    menuClass: PropTypes.string
  },

  componentDidMount() {
    return window.addEventListener('click', this.props.closeMenu, false);
  },

  componentWillUnmount() {
    return window.removeEventListener('click', this.props.closeMenu, false);
  },

  linkParams(props) {
    return {
      library_id: props.params.library_id,
      module_id: props.params.module_id
    };
  },

  _slideLink(params) {
    return `/training/${params.library_id}/${params.module_id}/${params.slide_id}`;
  },

  render() {
    if (!this.props.slides) { return <div />; }
    // need the slide index because overflow: hidden cuts off li numbering
    const slides = this.props.slides.map((slide, loopIndex) => {
      const current = slide.id === this.props.currentSlide.id;
      const liClass = current ? 'current' : '';
      const newParams = extend(this.linkParams(this.props), { slide_id: slide.slug });
      const slideLink = this._slideLink(newParams);
      // a slide is enabled if it comes back from the API as such,
      // it is set enabled in the parent component,
      // or it's the current slide
      let slideTitle = slide.title;
      if (slide.translations && slide.translations[I18n.locale]) {
        slideTitle = slide.translations[I18n.locale].title;
      }
      const enabled = (slide.enabled === true || this.props.enabledSlides.indexOf(slide.id) >= 0) && !current;
      return (
        <li key={[slide.id, loopIndex].join('-')} onClick={this.props.onClick} className={liClass}>
          <a disabled={!enabled} href={slideLink}>
            {loopIndex + 1}. {slideTitle}
          </a>
        </li>
      );
    }
    );

    let menuClass = 'slide__menu__nav__dropdown ';
    menuClass += this.props.menuClass;

    return (
      <div className={menuClass}>
        <span className="dropdown__close pull-right" onClick={this.props.onClick}>&times;</span>
        <h1 className="h5 capitalize">{I18n.t('training.table_of_contents')}</h1>
        <ol>
          {slides}
        </ol>
      </div>
    );
  }

});

export default SlideMenu;
