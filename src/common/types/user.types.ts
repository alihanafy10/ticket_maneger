import {
    updatePasswordBodyDto,
  updateUserBodyDto,
  updateUserRoleBodyDto,
  updateUserRoleParamsDto,

} from '../../modules/user/dto';
import { z } from 'zod';

export type TupdateUserBodyDto = z.infer<typeof updateUserBodyDto>;
export type TupdateUserRoleBodyDto = z.infer<typeof updateUserRoleBodyDto>;
export type TupdateUserRoleParamsDto = z.infer<typeof updateUserRoleParamsDto>;
export type TupdatePasswordBodyDto = z.infer<typeof updatePasswordBodyDto>;
