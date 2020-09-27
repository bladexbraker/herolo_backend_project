import express from 'express';

import { UsersRoutes } from './users';
import { MessagesRoutes } from './messages';
import { authenticateToken, initUserMessagesIfNeeded } from '~/modules/middleware';

const router = express.Router();

router.use('/users', UsersRoutes);

//after login
router.use(authenticateToken);

//before messages
router.use(initUserMessagesIfNeeded);

router.use('/messages', MessagesRoutes);

export const Routes = router;
