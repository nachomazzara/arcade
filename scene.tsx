import { createElement, ScriptableScene } from "metaverse-api";

export default class RollerCoaster extends ScriptableScene<any> {
  state = { src: "" };
  connection: WebSocket | null = null;

  sceneWillUnmount() {
    this.connection!.close();
  }

  sceneDidMount() {
    this.connection = new WebSocket("ws://localhost:8989", ["soap", "xmpp"]);
    this.connection!.addEventListener("message", (e: MessageEvent) => {
      this.setState({
        src: e.data
      });
    });
    this.eventSubscriber.on("btn_left_click", () => {
      this.connection!.send("left");
    });
    this.eventSubscriber.on("btn_up_click", () => {
      this.connection!.send("up");
    });
    this.eventSubscriber.on("btn_right_click", () => {
      this.connection!.send("right");
    });
    this.eventSubscriber.on("btn_down_click", () => {
      this.connection!.send("down");
    });

    this.eventSubscriber.on("btn_retry_click", () => {
      this.connection!.send("retry");
    });
  }

  async render() {
    const { src } = this.state;

    return (
      <scene position={{ x: 5, y: 1, z: 5 }}>
        <entity position={{ x: 0, y: -0.5, z: 0 }}>
          <plane
            position={{ x: 0, y: 1, z: -0.1 }}
            material={{ src, color: "#red", transparent: true }}
            rotation={{ x: 0, y: 10, z: 0 }}
          />
          <entity
            position={{ x: 0.8, y: 1, z: 0 }}
            rotation={{ x: 90, y: -25, z: 0 }}
          >
            <cylinder
              id="btn_down"
              position={{ x: 0, y: 0, z: 0.2 }}
              color="green"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
            <cylinder
              id="btn_left"
              position={{ x: -0.2, y: 0, z: 0 }}
              color="blue"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
            <cylinder
              id="btn_right"
              position={{ x: 0.2, y: 0, z: 0 }}
              color="blue"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
            <cylinder
              id="btn_up"
              position={{ x: 0, y: 0, z: -0.2 }}
              color="green"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
            <cylinder
              id="btn_retry"
              position={{ x: 0, y: 0, z: 0 }}
              color="black"
              scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            />
          </entity>
        </entity>
      </scene>
    );
  }
}
