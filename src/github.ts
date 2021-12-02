import {Octokit} from '@octokit/rest'
export interface GithubOptions {
  originOwner: string
  upstreamOwner: string
  repo: string
  token: string
  userAgent: string
}

export class Github {
  private readonly owner: string
  private readonly upstreamOwner: string
  private readonly repo: string
  private readonly github: Octokit

  constructor({
    originOwner,
    upstreamOwner,
    repo,
    token,
    userAgent
  }: GithubOptions) {
    this.owner = originOwner
    this.upstreamOwner = upstreamOwner
    this.repo = repo
    this.github = new Octokit({
      baseUrl: 'https://api.github.com',
      auth: token || 'invalid token',
      userAgent,
      request: {
        agent: undefined,
        fetch: undefined,
        timeout: 0
      }
    })
  }

  async getLatestRelease(
    {owner, repo} = {owner: this.owner, repo: this.repo}
  ): ReturnType<Octokit['repos']['getLatestRelease']> {
    return this.github.repos.getLatestRelease({owner, repo})
  }

  async getHEADCommit(): ReturnType<Octokit['repos']['getCommit']> {
    return this.github.repos.getCommit({
      owner: this.upstreamOwner,
      repo: this.repo,
      ref: 'HEAD'
    })
  }

  async getPullRequestsByHead(
    head: string
  ): ReturnType<Octokit['pulls']['list']> {
    return this.github.pulls.list({
      owner: this.upstreamOwner,
      repo: this.repo,
      head: `${this.owner}:${head}`,
      state: 'all'
    })
  }

  async getOutPullRequests(): ReturnType<Octokit['pulls']['list']> {
    return this.github.pulls.list({
      owner: this.upstreamOwner,
      repo: this.repo,
      state: 'open'
    })
  }

  async closePullRequest(
    number: number
  ): ReturnType<Octokit['pulls']['update']> {
    return this.github.pulls.update({
      owner: this.upstreamOwner,
      repo: this.repo,
      pull_number: number,
      state: 'closed'
    })
  }

  async getBranch(branch: string): ReturnType<Octokit['repos']['getBranch']> {
    return this.github.repos.getBranch({
      branch,
      owner: this.owner,
      repo: this.repo
    })
  }

  async createPullRequests(
    branch: string,
    title: string,
    body: string
  ): ReturnType<Octokit['pulls']['create']> {
    return this.github.pulls.create({
      title,
      body,
      owner: this.upstreamOwner,
      repo: this.repo,
      head: `${this.owner}:${branch}`,
      base: 'master',
      maintainer_can_modify: true
    })
  }

  async updatePullRequest(
    number: number,
    title: string,
    body: string
  ): ReturnType<Octokit['pulls']['update']> {
    return this.github.pulls.update({
      title,
      body,
      pull_number: number,
      owner: this.upstreamOwner,
      repo: this.repo,
      state: 'open',
      maintainer_can_modify: true
    })
  }
}
