import { Component } from '@angular/core';
import { ServerStatusService } from './server-status.service';

@Component({
  selector: 'app-root',
   template: `
    <div *ngIf="serverStatus === 'offline'" class="alert alert-danger">
      ⚠️ Sever is offline!
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FHE-Webapplication';
    serverStatus: string = 'online';

  constructor(private serverStatusService: ServerStatusService) {}

  ngOnInit() {
    this.serverStatusService.checkServer().subscribe(status => {
      this.serverStatus = status;
      console.log('Server is', status);
    });
  }
}


