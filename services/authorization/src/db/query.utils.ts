import { setUserForApp } from '@appcompass/common';

export const dbUserIdVarName = 'app.auth.auth_user_id';

export const setUser = setUserForApp(dbUserIdVarName);
