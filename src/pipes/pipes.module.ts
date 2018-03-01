import { NgModule } from '@angular/core';
import { YoutubePipe } from './youtube/youtube';
import { SanitizeHtmlPipe } from './sanitize-html/sanitize-html';
@NgModule({
	declarations: [YoutubePipe,
    SanitizeHtmlPipe],
	imports: [],
	exports: [YoutubePipe,
    SanitizeHtmlPipe]
})
export class PipesModule {}
