import React, {ReactNode, createContext, useContext, useState} from "react";
import auth from "firebase/auth";

type Character = {
  name: string;
  age: number;
  profession: string;
  open: string;
  private: string;
  timeline: {
    num: number;
    text: string;
  }[];
  purpose: string;
};

export enum CreateState {
  Default,
  CliminalCharacter,
  OtherCharacter,
  ItemInfo,
  World,
  Hint,
  Trick,
  Image,
  Room,
}

export enum CharacterType {
  Default,
  Criminal,
  Other,
}

export type ClueItem = {
  scenarioId: number;
  mapId: number;
  uri: string;
  name: string;
  coordinate?: {
    x: number;
    y: number;
  };
};

export type FloorMap = {
  mapId: number;
  scenarioId: number;
  uri: string;
  name: string;
};

const SampleClueItems: ClueItem[] = [
  {
    scenarioId: 1,
    mapId: 101,
    uri: "http://example.com/clues/clue1.jpg",
    name: "Mysterious Key",
  },
  {
    scenarioId: 2,
    mapId: 102,
    uri: "http://example.com/clues/clue2.jpg",
    name: "Ancient Scroll",
  },
  {
    scenarioId: 3,
    mapId: 103,
    uri: "http://example.com/clues/clue3.jpg",
    name: "Silver Coin",
    coordinate: {
      x: 200,
      y: 300,
    },
  },
  // 他のサンプルデータを必要に応じて追加...
];

type CreateScenarioContextType = {
  tabId: number;
  setTabId: React.Dispatch<React.SetStateAction<number>>;
  phase: number;
  setPhase: React.Dispatch<React.SetStateAction<number>>;
  criminal: Character | undefined;
  setCriminal: React.Dispatch<React.SetStateAction<Character | undefined>>;
  otherCharacters: Character[];
  setOtherCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  isCreatingCharacter: boolean;
  setIsCreatingCharacter: React.Dispatch<React.SetStateAction<boolean>>;
  isOther: boolean;
  setIsOther: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingClue: boolean;
  setIsCreatingClue: React.Dispatch<React.SetStateAction<boolean>>;
  isWorld: boolean;
  setIsWorld: React.Dispatch<React.SetStateAction<boolean>>;
  isHint: boolean;
  setIsHint: React.Dispatch<React.SetStateAction<boolean>>;
  isTrick: boolean;
  setIsTrick: React.Dispatch<React.SetStateAction<boolean>>;
  clueItems: ClueItem[];
  setClueItems: React.Dispatch<React.SetStateAction<ClueItem[]>>;
  phenomena: string[];
  setPhenomena: React.Dispatch<React.SetStateAction<string[]>>;
  tricks: {
    name: string;
    uncommonSense: string;
    principle: string;
    illusion: string;
  }[];
  setTricks: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        uncommonSense: string;
        principle: string;
        illusion: string;
      }[]
    >
  >;
  editingCharacter: Character | undefined;
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>>;
  isItemInfo: boolean;
  setIsItemInfo: React.Dispatch<React.SetStateAction<boolean>>;
  isImageCreate: boolean;
  setIsImageCreate: React.Dispatch<React.SetStateAction<boolean>>;
  shareJson: any;
  setShareJson: React.Dispatch<React.SetStateAction<any>>;
  createState: CreateState;
  setCreateState: React.Dispatch<React.SetStateAction<CreateState>>;
  pageStack: CreateState[];
  setPageStack: React.Dispatch<React.SetStateAction<CreateState[]>>;
  floorMaps: FloorMap[];
  setFloorMaps: React.Dispatch<React.SetStateAction<FloorMap[]>>;
  targetId?: number;
  setTargetId: React.Dispatch<React.SetStateAction<number | undefined>>;
  transitNextState: (createState: CreateState) => void;
  transitPrevState: () => void;
  nowCharacterType: CharacterType;
  setNowCharacterType: React.Dispatch<React.SetStateAction<CharacterType>>;
};

const CreateScenarioContext = createContext<
  CreateScenarioContextType | undefined
>(undefined);

export function useCreateScenario() {
  const context = useContext(CreateScenarioContext);
  if (!context) {
    throw new Error(
      "useCreateScenario must be used within a CreateScenarioProvider",
    );
  }
  return context;
}

export const CreateScenarioProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [tabId, setTabId] = useState<number>(1);
  const [phase, setPhase] = useState<number>(1);
  const [criminal, setCriminal] = useState<Character>();
  const [otherCharacters, setOtherCharacters] = useState<Character[]>([]);
  const [isCreatingCharacter, setIsCreatingCharacter] =
    useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);
  const [isCreatingClue, setIsCreatingClue] = useState<boolean>(false);
  const [isWorld, setIsWorld] = useState<boolean>(false);
  const [isHint, setIsHint] = useState<boolean>(false);
  const [isTrick, setIsTrick] = useState<boolean>(false);
  const [clueItems, setClueItems] = useState<ClueItem[]>(SampleClueItems);
  const [floorMaps, setFloorMaps] = useState<FloorMap[]>([]);
  const [targetId, setTargetId] = useState<number | undefined>(undefined);
  const [phenomena, setPhenomena] = useState<string[]>([]);
  const [tricks, setTricks] = useState<
    {
      name: string;
      uncommonSense: string;
      principle: string;
      illusion: string;
    }[]
  >([]);
  const [editingCharacter, setEditingCharacter] = useState<Character>({
    name: "",
    age: 0,
    profession: "",
    open: "",
    private: "",
    timeline: [
      {
        num: 0,
        text: "",
      },
    ],
    purpose: "",
  });
  const [isItemInfo, setIsItemInfo] = useState<boolean>(false);
  const [isImageCreate, setIsImageCreate] = useState<boolean>(false);
  const [shareJson, setShareJson] = useState({});
  const [createState, setCreateState] = useState(CreateState.Default);
  const [pageStack, setPageStack] = useState([CreateState.Default]);
  const [nowCharacterType, setNowCharacterType] = useState(
    CharacterType.Default,
  );

  const transitNextState = (createState: CreateState, targetId?: number) => {
    setTargetId(targetId);
    setPageStack([...pageStack, createState]);
    setCreateState(createState);
  };

  const transitPrevState = () => {
    const bufStack: CreateState[] = [...pageStack];

    bufStack.pop();
    setPageStack([...bufStack]); // NOTE: ディープコピーにすることで後述の副作用を回避

    setCreateState(bufStack.pop() || CreateState.Default);
  };

  return (
    <CreateScenarioContext.Provider
      value={{
        tabId,
        setTabId,
        phase,
        setPhase,
        criminal,
        setCriminal,
        otherCharacters,
        setOtherCharacters,
        isCreatingCharacter,
        setIsCreatingCharacter,
        isOther,
        setIsOther,
        isCreatingClue,
        setIsCreatingClue,
        isWorld,
        setIsWorld,
        isHint,
        setIsHint,
        isTrick,
        setIsTrick,
        clueItems,
        setClueItems,
        phenomena,
        setPhenomena,
        tricks,
        setTricks,
        editingCharacter,
        setEditingCharacter,
        isItemInfo,
        setIsItemInfo,
        isImageCreate,
        setIsImageCreate,
        shareJson,
        setShareJson,
        createState,
        setCreateState,
        pageStack,
        setPageStack,
        transitNextState,
        transitPrevState,
        nowCharacterType,
        setNowCharacterType,
        floorMaps,
        setFloorMaps,
        targetId,
        setTargetId,
      }}>
      {children}
    </CreateScenarioContext.Provider>
  );
};
