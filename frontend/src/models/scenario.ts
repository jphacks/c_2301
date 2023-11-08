// Firestoreに格納するデータの型
export type Scenario = {
  abstraction: Abstraction;
  characters: Character[];
  phases: Phase[];
  floorMaps: FloorMap[];
  items: Item[];
};

export type Abstraction = {
  title: string;
  outline: string;
  numberOfPlayers: number;
};

export type Character = {
  nameKanji: string;
  nameKana: string;
  age: number;
  icon: any;
  profession: string;
  description: string;
  about: string;
  purpose: string;
  type: CharacterType;
};

export enum CharacterType {
  Default,
  Criminal,
  Other,
}

export type FloorMap = {
  mapId: string;
  name: string;
  uri: any;
};

export type Phase = {
  name: string;
  numberOfSurveys: number;
};

export type Item = {
  itemId: string;
  mapId: string; // 配置するマップID
  name: string;
  uri: string;
  category: string;
  description: string;
  coordinate: {
    x: number;
    y: number;
  };
};

export type Trick = {
  name: string;
  uncommonSense: string;
  principle: string;
  illusion: string;
};