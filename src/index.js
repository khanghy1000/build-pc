import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import 'dotenv/config';

import { getHomepage } from './handlers/homepage.js';
import { getGuide } from './handlers/guide.js';
import { getRegister, postRegister } from './handlers/auth/register.js';
import {
  getForgotPassword,
  postForgotPassword,
} from './handlers/auth/forgotPassword.js';
import {
  getRenewPassword,
  postRenewPassword,
} from './handlers/auth/renewPassword.js';
import { getLogin, postLogin } from './handlers/auth/login.js';
import { logout } from './handlers/auth/logout.js';
import { getRamUpdate } from './handlers/ramUpdate.js';
import { updateStorage } from './handlers/storageUpdate.js';
import {
  deleteComponent,
  insertComponent,
  selectComponent,
} from './handlers/component.js';
import {
  getBuild,
  createBuild,
  updateBuildStatus,
  updateBuildName,
  updateBuildDesc,
  getBuildList,
  getBuildListPublic,
  searchBuild,
} from './handlers/build.js';

import { client } from './db.js';
import { transporter } from './email.js';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.set('views', './src');
app.set('view engine', 'ejs');

app.get('/', getHomepage);
app.get('/guide', getGuide);

app.get('/login', getLogin);
app.post('/submit_login', postLogin);

app.get('/register', getRegister);
app.post('/submit_register', postRegister);

app.get('/forgot_password', getForgotPassword);
app.post('/forgot_submit', postForgotPassword);

app.get('/renew_password', getRenewPassword);
app.post('/renew_password_submit', postRenewPassword);

app.get('/logout', logout);

app.get('/ram-update', getRamUpdate);
app.get('/storage-update', updateStorage);
app.get('/delete-component/*', deleteComponent);
app.get('/component-insert/*', insertComponent);
app.get('/component-select/*', selectComponent);

//build
app.get('/build_list', getBuildList);
app.get('/create_build', createBuild);
app.get('/update-status', updateBuildStatus);
app.get('/update-build-name', updateBuildName);
app.get('/update-build-desc', updateBuildDesc);
app.get('/build', getBuild);
app.get('/build_list_public', getBuildListPublic);
app.get('/search-build', searchBuild);

app.listen(9000, () => {
  console.log('pcbuild at 9000 \n');
});
