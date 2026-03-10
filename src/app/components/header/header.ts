import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [Navbar,RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
