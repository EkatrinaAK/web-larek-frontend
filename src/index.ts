import './scss/styles.scss';

import { API_URL, CDN_URL } from "./utils/constants";
import { CardAPI } from './components/CardAPI'
//import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
//import { Modal } from './components/common/Modal';
//import { ensureElement, cloneTemplate } from './utils/utils';
import { AppContent } from './components/AppState';


const api = new CardAPI (CDN_URL, API_URL);// управление API
const event = new EventEmitter();//управление событиями
const appState = new AppContent({},event);//модель данных

// запрс карточек
async function init () {
    const {items} = await api.getCardList();
	appState.setCatalog (items);
	console.log(items);
}

init();

