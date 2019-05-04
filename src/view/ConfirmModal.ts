import { css } from 'emotion';
import i18n from './i18n';

const WIDTH_FOR_PC = 481;

const colors = {
  // Red
  lightRed: '#ff8a80',
  red: '#ff4949',
  darkRed: '#ea2828',
  extraDarkRed: '#c01616',
  // Blue
  lightBlue: '#85d7ff',
  blue: '#1fb6ff',
  darkBlue: '#009eeb',
  extraDarkBlue: '#003980',
  // Gray
  lightGray: '#c9caca',
  gray: '#727171',
  darkGray: '#cfd8dc',
  extraDarkGray: '#333',

  // basic
  cloud: '#b0bec5',
  black: '#000',
  white: '#fff',
};

const styleCommon = `
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const styleButton = `
  ${styleCommon}
  width: 100%;
  font-size: 10px;
  padding: 6px 10px;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color .18s ease-in-out;
`;

const styledContainer = css`
  ${styleCommon};
  position: fixed;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.white};
  border-color: ${colors.cloud};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.30);
  display: flex;
  animation: show .18s linear 0s;
  @keyframes show {
    from {
      display: none;
      opacity: 0;
    }
    to {
      display: flex;
      opacity: 1;
    }
  }

  padding: 4px 2px 4px 2px;
  top: auto;
  right: auto;
  left: 0;
  bottom: 0;
  width: 100%;

  // PC(タブレット)向けのCSS
  @media screen and (min-width: ${WIDTH_FOR_PC}px){
    // 横幅180px で右上に固定表示
    padding: 16px 8px 16px 8px;
    left: auto;
    bottom: auto;
    top: 20px;
    right: 20px;
    width: 180px;
  }
`;

const styledContent = css`
  ${styleCommon};
  width: 100%;
  & > div{
    ${styleCommon};
    padding: 0 4px;
    margin-bottom: 2px;
    & > span {
      ${styleCommon};
      font-size: 12px;
      color: ${colors.black};
    }
  }

  & > ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    list-style-type: none;
    padding: 0;
    margin: 0;
    & > li {
      width: 100%;
      margin-bottom: 2px;
      padding: 0 4px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // PC(タブレット)向けのCSS
  @media screen and (min-width: ${WIDTH_FOR_PC}px){
    & > div{
      margin-bottom: 8px;
    }
    & > ul{
      flex-direction: column;
      & > li{
        margin-bottom: 8px;
      }
    }
  }
`;

const styledSubmitButton = css`
  ${styleButton};
  background-color: ${colors.blue};
  color: ${colors.white};
  &:hover {
    background-color: ${colors.darkBlue};
  }
  &:active {
    background-color: ${colors.extraDarkBlue};
  }
  &:disabled {
    background-color: ${colors.lightBlue};
    cursor: not-allowed;
  }
`;

const styledDeleteButton = css`
  ${styleButton};
  background-color: ${colors.red};
  color: ${colors.white};
  &:hover {
    background-color: ${colors.darkRed};
  }
  &:active {
    background-color: ${colors.extraDarkRed};
  }
  &:disabled {
    background-color: ${colors.lightRed};
    cursor: not-allowed;
  }
`;

const styledCloseButton = css`
  ${styleButton};
  background-color: ${colors.darkGray};
  color: ${colors.black};
  &:hover {
    background-color: $extra-dark-cloud;
  }
  &:active {
    color: ${colors.extraDarkGray};
    background-color: ${colors.gray};
  }
  &:disabled {
    color: ${colors.extraDarkGray};
    background-color: ${colors.lightGray};
    cursor: not-allowed;
  }
`;

// ピュアなDOMのスタイルにemotionを適用してみた
export default (zIndex?: number) => {
  const z = zIndex ? zIndex : 100;
  return `<div
      class="${styledContainer}"
      style="z-index: ${z}"
    >
      <div class="${styledContent}">
        <div>
          <span>${i18n.t('confirmMessage')}</span>
        </div>
        <ul>
          <li>
            <button class="${styledSubmitButton} buttonRecover">
            ${i18n.t('recover')}
            </button>
          </li>
          <li>
            <button class="${styledDeleteButton} buttonDestroy">
            ${i18n.t('destroy')}
            </button>
          </li>
          <li>
            <button class="${styledCloseButton} buttonClose">
              ${i18n.t('close')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  `;
};
