export namespace SpotifyApi {
  export interface CurrentUsersProfileResponse {
    id: string
    display_name: string
    email: string
    images: ImageObject[]
    product: string
    type: string
    uri: string
  }

  export interface ImageObject {
    url: string
    height: number | null
    width: number | null
  }

  export interface CurrentPlaybackResponse {
    device: Device
    shuffle_state: boolean
    repeat_state: string
    timestamp: number
    context: Context | null
    progress_ms: number | null
    item: TrackObject | null
    currently_playing_type: string
    is_playing: boolean
  }

  export interface Device {
    id: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent: number
  }

  export interface Context {
    uri: string
    href: string
    external_urls: ExternalUrlObject
    type: string
  }

  export interface ExternalUrlObject {
    spotify: string
  }

  export interface TrackObject {
    album: AlbumObject
    artists: ArtistObject[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalIdObject
    external_urls: ExternalUrlObject
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string | null
    track_number: number
    type: string
    uri: string
  }

  export interface AlbumObject {
    album_type: string
    artists: ArtistObject[]
    available_markets: string[]
    external_urls: ExternalUrlObject
    href: string
    id: string
    images: ImageObject[]
    name: string
    release_date: string
    release_date_precision: string
    type: string
    uri: string
  }

  export interface ArtistObject {
    external_urls: ExternalUrlObject
    href: string
    id: string
    name: string
    type: string
    uri: string
  }

  export interface ExternalIdObject {
    isrc?: string
    ean?: string
    upc?: string
  }

  export interface PlayHistoryObject {
    track: TrackObject
    played_at: string
    context: Context | null
  }

  export interface UserDevice {
    id: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent: number
  }

  export interface AlbumObjectFull extends AlbumObject {
    copyrights: CopyrightObject[]
    external_ids: ExternalIdObject
    genres: string[]
    label: string
    popularity: number
    tracks: PagingObject<TrackObject>
  }

  export interface CopyrightObject {
    text: string
    type: string
  }

  export interface PagingObject<T> {
    href: string
    items: T[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }

  export interface ArtistObjectFull extends ArtistObject {
    followers: FollowersObject
    genres: string[]
    images: ImageObject[]
    popularity: number
  }

  export interface FollowersObject {
    href: string | null
    total: number
  }

  export interface TrackObjectFull extends TrackObject {
    album: AlbumObjectFull
    external_ids: ExternalIdObject
    popularity: number
  }

  export interface AlbumObjectSimplified extends AlbumObject {
    album_group?: string
  }

  export interface PlaylistObjectFull {
    collaborative: boolean
    description: string | null
    external_urls: ExternalUrlObject
    followers: FollowersObject
    href: string
    id: string
    images: ImageObject[]
    name: string
    owner: UserObject
    public: boolean | null
    snapshot_id: string
    tracks: PagingObject<PlaylistTrackObject>
    type: string
    uri: string
  }

  export interface UserObject {
    display_name?: string
    external_urls: ExternalUrlObject
    followers?: FollowersObject
    href: string
    id: string
    images?: ImageObject[]
    type: string
    uri: string
  }

  export interface PlaylistTrackObject {
    added_at: string
    added_by: UserObject
    is_local: boolean
    track: TrackObject
  }

  export interface PlaylistObjectSimplified {
    collaborative: boolean
    description: string | null
    external_urls: ExternalUrlObject
    href: string
    id: string
    images: ImageObject[]
    name: string
    owner: UserObject
    public: boolean | null
    snapshot_id: string
    tracks: {
      href: string
      total: number
    }
    type: string
    uri: string
  }

  export interface SearchResponse {
    tracks?: PagingObject<TrackObject>
    artists?: PagingObject<ArtistObject>
    albums?: PagingObject<AlbumObject>
    playlists?: PagingObject<PlaylistObjectSimplified>
  }

  export interface UsersFollowedArtistsResponse {
    artists: {
      items: ArtistObjectFull[];
      next: string | null;
      total: number;
      cursors: {
        after: string | null;
      };
    };
  }

  export interface UsersSavedAlbumsResponse {
    items: {
      added_at: string;
      album: AlbumObjectSimplified;
    }[];
    next: string | null;
    total: number;
  }

  export interface UsersSavedTracksResponse {
    items: {
      added_at: string;
      track: TrackObjectFull;
    }[];
    next: string | null;
    total: number;
  }
} 