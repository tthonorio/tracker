import {
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { TrackingStatus } from '../../generated/prisma/client.js';

export class UpdateTrackingDto {
  @IsEnum(TrackingStatus)
  @IsOptional()
  status?: TrackingStatus;

  @IsNumber()
  @IsOptional()
  rating?: number;
}