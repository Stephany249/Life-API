import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { CreateWorkingDto } from './dto/create-working.dto';
import { WorkingService } from './working.service';

@Controller('working')
export class WorkingController {
  constructor(private workingService: WorkingService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('create/:crm')
  async createWorkingHours(
    @Param() crm,
    @Body() createWorkingDto: CreateWorkingDto,
  ): Promise<any> {
    const hours = await this.workingService.createWorkingHours(
      createWorkingDto,
      crm,
    );
    return hours;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:crm')
  async showWorkingHours(@Param() crm): Promise<any> {
    const hours = await this.workingService.getWorkingHours(crm);

    return hours;
  }
}
