export class Photo {
  constructor(public readonly id: string) {}

  get thumbnailUrl(): string {
    return `https://picsum.photos/id/${this.id}/400/300`;
  }

  get fullSizeUrl(): string {
    return `https://picsum.photos/id/${this.id}/1280/960`;
  }
}
