import {
  SetStyleRequest,
  MoveStylesRequest,
  GetStylesForPageRequest,
  EnableStyleRequest,
  DisableStyleRequest,
  GetAllStylesRequest,
  SetAllStylesRequest,
  GetStylesForIframeRequest,
  SetReadabilityRequest,
  GetStylesForPageResponse,
  GetAllStylesResponse,
} from '@stylebot/types';

import BackgroundPageStyles from '../styles';

type Request =
  | SetStyleRequest
  | MoveStylesRequest
  | GetAllStylesRequest
  | SetAllStylesRequest
  | GetStylesForPageRequest
  | GetStylesForIframeRequest
  | EnableStyleRequest
  | DisableStyleRequest
  | SetReadabilityRequest;

type Response = GetAllStylesResponse | GetStylesForPageResponse;

export default (
  request: Request,
  styles: BackgroundPageStyles,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: Response) => void
): void => {
  if (request.name === 'setStyle') {
    styles.set(request.url, request.css);
  } else if (request.name === 'enableStyle') {
    styles.enable(request.url);
  } else if (request.name === 'disableStyle') {
    styles.disable(request.url);
  } else if (request.name === 'getAllStyles') {
    sendResponse(styles.getAll());
  } else if (request.name === 'setAllStyles') {
    styles.setAll(request.styles);
  } else if (request.name === 'moveStyles') {
    styles.move(request.sourceUrl, request.destinationUrl);
  } else if (request.name === 'setReadability') {
    styles.setReadability(request.url, request.value);
  } else if (request.name === 'getStylesForPage') {
    const tab = sender.tab || request.tab;

    if (!tab || !tab.url) {
      return;
    }

    const response = styles.getStylesForPage(tab.url, request.important);
    styles.updateBrowserAction(tab, response.styles);
    sendResponse(response);
  } else if (request.name === 'getStylesForIframe') {
    sendResponse(styles.getStylesForPage(request.url, request.important));
  }
};
