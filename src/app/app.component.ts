import { Component } from '@angular/core';
import { ServerStatusService } from './server-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
      if (status !== 'online') {
        alert('Warning: The server is currently offline or unreachable.');
      }
    });
  }
}


