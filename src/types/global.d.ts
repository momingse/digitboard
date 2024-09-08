export declare global {
  enum Shape {
    line = "line",
    circle = "circle",
    rect = "rect",
    image = "image",
  }

  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
    erase: boolean;
    shape: keyof typeof Shape;
  }

  interface CircleInfo {
    cX: number;
    cY: number;
    radiusX: number;
    radiusY: number;
  }

  interface RectInfo {
    width: number;
    height: number;
  }

  interface ImgInfo {
    base64: string;
  }

  interface Move {
    circle: CircleInfo;
    rect: RectInfo;
    img: ImgInfo;
    path: [number, number][];
    options: CtxOptions;
    timestamp: number;
    eraser: boolean;
    id: string;
  }

  type Room = {
    usersMoves: Map<string, Move[]>;
    drawed: Move[];
    users: Map<string, string>;
  };

  interface Message {
    userId: string;
    username: string;
    color: string;
    msg: string;
    id: number;
  }

  interface User {
    name: string;
    color: string;
  }

  interface ClientRoom {
    id: string;
    usersMoves: Map<string, Move[]>;
    users: Map<string, User>;
    movesWithoutUser: Move[];
    myMoves: Move[];
  }

  interface ServerToClientEvents {
    your_move: (move: Move) => void;
    new_msg: (userId: string, msg: string) => void;
    room_exists: (exists: boolean) => void;
    room: (
      drawed: Move[],
      usersMovesToParse: string,
      usesToParse: string,
    ) => void;
    created: (roomId: string) => void;
    joined: (roomId: string, failed?: boolean) => void;
    user_draw: (newMoves: Move, userId: string) => void;
    user_undo: (userId: string) => void;
    mouse_moved: (x: number, y: number, userId: string) => void;
    new_user: (userId: string, username: string) => void;
    user_disconnect: (userId: string) => void;
  }

  interface ClientToServerEvents {
    check_room: (roomId: string) => void;
    draw: (moves: Move) => void;
    mouse_move: (x: number, y: number) => void;
    undo: () => void;
    create_room: (username: string) => void;
    join_room: (room: string, username: string) => void;
    joined_room: () => void;
    leave_room: () => void;
    send_msg: (msg: string) => void;
  }
}
