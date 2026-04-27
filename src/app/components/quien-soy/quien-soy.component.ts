import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent implements OnInit {
  githubUsername = 'octocat'; // Reemplazar con el usuario real de GitHub
  userProfile: any = null;
  loading = true;

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.githubService.getUserProfile(this.githubUsername).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching github profile', err);
        this.loading = false;
      }
    });
  }
}
