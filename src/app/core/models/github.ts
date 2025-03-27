export interface GithubRepository{
    id: string;
    username: string;
    repository: string;
    token?: string;
    githubCommits?: GithubCommit[];
}

export interface GithubRepositoryUpdate {
    username: string;
    repositoryName: string;
    token: string;
  }

export interface GithubCommit {
    author: string;
    date: string;
    message: string;
  }