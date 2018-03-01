import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the SanitizeHtmlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor (private dom: DomSanitizer) {}
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    return this.dom.bypassSecurityTrustHtml(value);
  }
}
