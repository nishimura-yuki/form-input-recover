import { css } from 'emotion';

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
  top: 20px;
  right: 20px;
  width: 180px;
  padding: 16px 8px 16px 8px;
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
`;

const styledContent = css`
  ${styleCommon};
  width: 100%;
  & > div{
    ${styleCommon};
    margin-bottom: 8px;
    & > p {
      ${styleCommon};
      font-size: 12px;
      color: ${colors.black};
    }
  }

  & .message {
    ${styleCommon};
    margin-top: 8px;
    margin-bottom: 8px;
    color: ${colors.red};
    font-size: 10px;
  }
  & > ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    list-style-type: none;
    padding: 0;
    margin: 0;
    & > li {
      width: 100%;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
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
          <p>以前入力した内容を</p>
          <p>復元しますか？</p>
        </div>
        <ul>
          <li>
            <button class="${styledSubmitButton} buttonRecover">
              復元
            </button>
          </li>
          <li>
            <button class="${styledDeleteButton} buttonDestroy">
              削除
            </button>
          </li>
          <li>
            <button class="${styledCloseButton} buttonClose">
              閉じる
            </button>
          </li>
        </ul>
      </div>
    </div>
  `;
};
