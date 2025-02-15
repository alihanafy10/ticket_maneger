import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {  TupdatePasswordBodyDto, TupdateUserBodyDto, TupdateUserRoleBodyDto, TupdateUserRoleParamsDto } from "../../common/types";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../common/schemas";
import { Model } from "mongoose";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { EmailService } from "../../services/email/email.service";
import { CheakExisit } from "../../services";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly cheakExisit:CheakExisit
  ) {}

  /**
   *
   * @param {TupdateUserBodyDto} body 
   * @param {any} req -authUser 
   * @param file
   *
   * @throws {BadRequestException}-email already exists
   *
   * @returns {User}
   */
  async updateUser(
    body: TupdateUserBodyDto,
    req: any,
    file: Express.Multer.File,
  ): Promise<User> {
    //featch data from body
    const { name, email } = body;

    //authUser
    const authUser = req['authUser'];

    //check if email exists
    if (email) {
      //cheack if email exists
      const isEmailExist = await this.userModel.findOne({ email });
      if (isEmailExist) throw new BadRequestException('email already exists');
      await this.emailService.sendEmails(email, name, req);
      authUser.email = email;
      authUser.isEmailVerified = false;
    }
    if (name){ 

      //cheak if name exists
      await this.cheakExisit.cheakExisit(this.userModel,name)

      authUser.name = name;
    }

    if (file) {
      //splited public_id
      const splitedPublic_id = authUser.image.public_id.split('/')[2];

      const { public_id, secure_url } = await this.cloudinaryService.uploadFile(
        file,
        {
          folder: `${process.env.UPLOADE_FOLDER}/Users`,
          public_id: splitedPublic_id,
        },
      );
      authUser.image.public_id = public_id;
      authUser.image.secure_url = secure_url;
    }

    //updated user
    const updatedUserData = await this.userModel
      .findByIdAndUpdate(authUser._id, authUser, { new: true })
      .select('-password');

    return updatedUserData;
  }

  /**
   * update userRole
   * @param {TupdateUserRoleBodyDto} body
   * @param {TupdateUserRoleParamsDto} param
   * @throws {NotFoundException} -if user not found
   * @returns {User}
   */
  async updateUserRole(
    body: TupdateUserRoleBodyDto,
    param: TupdateUserRoleParamsDto,
  ): Promise<User> {
    //chick if user exists and update
    const user = await this.userModel
      .findByIdAndUpdate(
        param.userId,
        { userRole: body.userRole },
        { new: true },
      )
      .select('-password');
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  /**
   * update user password
   * @param {TupdatePasswordBodyDto} body
   * @param {any} req - authUser
   * */
  async updatePass(body: TupdatePasswordBodyDto,req: any):Promise<void> {
    const authUser = req.authUser
    authUser.password = body.password
    await authUser.save();
  };

  /**
   * get user profile info
   * @param {any} authUser
   * @returns {User}
   */
async profileInfo(authUser:any): Promise<User>{
  return this.userModel.findById(authUser._id).select('-password');
}

/**
 * 
 * @param authUser 
 * @returns 
 */
async deleteProfile(authUser:any): Promise<void>{
//delete by update isMarkedAsDeleted  =>true
  const data=await this.userModel.findByIdAndUpdate(authUser._id, { isMarkedAsDeleted: true }, { new: true });
  if(!data)throw new BadRequestException('category not found')

}


}