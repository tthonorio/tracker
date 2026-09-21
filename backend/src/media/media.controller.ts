import { Controller, Get, Query } from '@nestjs/common';
import { MediaService } from './media.service.js';
import { MediaSearchQueryDto } from './dto/media-search-query.dto.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query.q);
  }
}
