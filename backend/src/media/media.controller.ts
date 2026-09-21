import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { MediaService } from './media.service.js';
import { MediaSearchQueryDto } from './dto/media-search-query.dto.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query.q);
  }

  @Get('movie/:id')
  getMovieDetails(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.getMovieDetails(id);
  }

  @Get('tv/:id')
  getTvDetails(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.getTvDetails(id);
  }
}