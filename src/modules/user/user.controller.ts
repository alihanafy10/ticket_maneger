import { Body, Controller, Delete, Get, Param, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from "./user.service";
import {  TupdatePasswordBodyDto, TupdateUserBodyDto, TupdateUserRoleBodyDto, TupdateUserRoleParamsDto  } from "../../common/types";
import { Auth } from "../../common/decorator";
import { UserRole } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import {  updatePasswordBodyDto, updateUserBodyDto, updateUserRoleBodyDto, updateUserRoleParamsDto } from "./dto";
import { createFileUploadPipe } from '../../common/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('updateUser')
  @UseInterceptors(FileInterceptor('image'))
  @Auth([ UserRole.ADMIN, UserRole.CLASSIFIER, UserRole.MANAGER, UserRole.USER])
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ZodValidationPipe(updateUserBodyDto)) body: TupdateUserBodyDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Response> {
     //If the file exists from it via => createFileUploadPipe
     if (file) {
      await createFileUploadPipe().transform(file);
    }
    const data = await this.userService.updateUser(body, req, file);
    return res.status(201).json({ message: 'updated successfully', data });
  }

  @Put('updateUserRole/:userId')
  @Auth([UserRole.MANAGER])
  async updateUserRole(
    @Body(new ZodValidationPipe(updateUserRoleBodyDto))
    body: TupdateUserRoleBodyDto,
    @Param(new ZodValidationPipe(updateUserRoleParamsDto))
    param: TupdateUserRoleParamsDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.userService.updateUserRole(body, param);
    return res.status(201).json({ message: 'updated successfully', data });
  }

  @Put('updatePass')
  @Auth([UserRole.ADMIN, UserRole.CLASSIFIER,UserRole.USER, UserRole.MANAGER])
  async updatePass(
    @Body(new ZodValidationPipe(updatePasswordBodyDto))
    body: TupdatePasswordBodyDto,
    @Req() req:Request,
    @Res() res: Response
  ):Promise<Response> {
    await this.userService.updatePass(body, req);
    return res.status(201).json({ message: 'updated successfully'});
  }

  @Get('profileInfo')
  @Auth([UserRole.ADMIN, UserRole.CLASSIFIER,UserRole.USER, UserRole.MANAGER])
  async profileInfo(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const authUser=req['authUser']
    const data = await this.userService.profileInfo(authUser);
    return res.status(200).json({ data });
  }

  @Delete('deleteProfile')
  @Auth([UserRole.ADMIN, UserRole.CLASSIFIER,UserRole.USER, UserRole.MANAGER])
  async deleteProfile(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const authUser=req['authUser']
    await this.userService.deleteProfile(authUser);
    return res.status(201).json({ message: 'deleted successfully' });
  }
}

