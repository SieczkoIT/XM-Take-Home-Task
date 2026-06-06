export class Photo {
  constructor(
    public readonly id: string,
    public readonly url: string,
  ) {}

  get thumbnailUrl(): string {
    return `https://picsum.photos/id/${this.id}/400/300`;
  }
}
