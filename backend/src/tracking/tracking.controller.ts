import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { TrackingService } from './tracking.service.js';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  create(@Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingService.create(createTrackingDto);
  }

  @Get()
  findAll(
    @Query('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.trackingService.findAll(userId);
  }

  @Get(':mediaId')
  findOne(
    @Query('userId', ParseIntPipe)
    userId: number,
    @Param('mediaId', ParseIntPipe)
    mediaId: number,
  ) {
    return this.trackingService.findOne(userId, mediaId);
  }

  @Patch(':mediaId')
  update(
    @Query('userId', ParseIntPipe)
    userId: number,
    @Param('mediaId', ParseIntPipe)
    mediaId: number,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.trackingService.update(
      userId,
      mediaId,
      updateTrackingDto,
    );
  }

  @Delete(':mediaId')
  remove(
    @Query('userId', ParseIntPipe)
    userId: number,
    @Param('mediaId', ParseIntPipe)
    mediaId: number,
  ) {
    return this.trackingService.remove(userId, mediaId);
  }
}