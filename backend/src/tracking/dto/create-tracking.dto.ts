import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { TrackingStatus } from '../../generated/prisma/client.js';

export class CreateTrackingDto {
  @IsInt()
  userId: number;

  @IsInt()
  mediaId: number;

  @IsEnum(TrackingStatus)
  status: TrackingStatus;

  @IsOptional()
  @IsNumber()
  rating?: number;
}