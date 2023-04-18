import { SetMetadata } from '@nestjs/common';
import { Role } from '../constant/roleCode';

export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);