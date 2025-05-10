
import { Api } from './components/base/Api';
import { Component } from './components/base/Component';
import { EventEmitter } from './components/base/events';
import { Model } from './components/model/Model';
import { Basket } from './components/view/Basket';
import { Form } from './components/view/Form';
import { Modal } from './components/view/Modal';
import { Order } from './components/view/Order';
import { Page } from './components/view/Page';
import { Success } from './components/view/Success';
import './scss/styles.scss';

const events = new EventEmitter();
const model = new Model(events);