import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('/home')
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Get('/themeOptions')
  async getThemeOptions() {
    return this.settingsService.getThemeOptions();
  }

  @Get('/')
  async getSettingsList() {
    return '';
  }
}
