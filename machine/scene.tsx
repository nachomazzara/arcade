import {
  createElement,
  ScriptableScene,
  Vector3Component
} from "metaverse-api";

export const Controls = (props: { position: Vector3Component }) => {
  return (
    <entity position={{ x: 0, y: 0.95, z: 0 }} rotation={{ x: 0, y: 0, z: 0 }}>
      <plane
        id="btn_down"
        position={{ x: 0, y: -0.2, z: 0 }}
        scale={{ x: 0.2, y: 0.2, z: 0.2 }}
        material={{
          color: "white",
          opacity: 0.1,
          transparent: true
        }}
      />

      <plane
        id="btn_left"
        position={{ x: -0.2, y: 0, z: 0 }}
        scale={{ x: 0.2, y: 0.2, z: 0.2 }}
        material={{
          color: "white",
          opacity: 0.1,
          transparent: true
        }}
      />

      <plane
        id="btn_right"
        position={{ x: 0.2, y: 0, z: 0 }}
        scale={{ x: 0.2, y: 0.2, z: 0.2 }}
        material={{
          color: "white",
          opacity: 0.1,
          transparent: true
        }}
      />

      <plane
        id="btn_up"
        position={{ x: 0, y: 0.2, z: 0 }}
        scale={{ x: 0.2, y: 0.2, z: 0.2 }}
        material={{
          color: "white",
          opacity: 0.1,
          transparent: true
        }}
      />
    </entity>
  );
};

export default class RollerCoaster extends ScriptableScene<any> {
  state = {
    score: 0,
    src1: "",
    src2: "",
    lastUpdated: "src1",
    switched: true
  };
  connection: WebSocket | null = null;

  sceneWillUnmount() {
    this.connection!.close();
  }

  sceneDidMount() {
    let isReady = false;
    this.connection = new WebSocket("wss://metarcade.club", ["soap", "xmpp"]);
    this.connection!.addEventListener("message", (e: MessageEvent) => {
      const { end, score, src, updateRate } = JSON.parse(e.data);
      if (!end) {
        this.setState({
          [this.state.lastUpdated]: src,
          lastUpdated: this.state.lastUpdated === "src1" ? "src2" : "src1",
          score
        });
        if (isReady)
          setTimeout(
            () => this.setState({ switched: !this.state.switched }),
            updateRate
          );
        isReady = true;
      }
    });

    this.eventSubscriber.on("btn_left_click", () => {
      this.connection!.send("left");
      this.setState({ constrolsSwitched: true });
    });
    this.eventSubscriber.on("btn_up_click", () => {
      this.connection!.send("up");
      this.setState({ constrolsSwitched: false });
    });
    this.eventSubscriber.on("btn_right_click", () => {
      this.connection!.send("right");
      this.setState({ constrolsSwitched: true });
    });
    this.eventSubscriber.on("btn_down_click", () => {
      this.connection!.send("down");
      this.setState({ constrolsSwitched: false });
    });

    this.eventSubscriber.on("btn_retry_click", () => {
      this.connection!.send("retry");
    });
  }

  getScore() {
    const val = "000000" + this.state.score;
    return val.substr(this.state.score.toString().length);
  }

  async render() {
    const { src1, src2, switched } = this.state;
    const attrs = await this.entityController!.getOwnAttributes();
    return (
      <scene position={attrs.position}>
        <obj-model
          src="assets/Arcade_v2.obj"
          mtl="assets/Arcade_v2.mtl"
          scale={{ x: 1.1, y: 1.1, z: 1.1 }}
          position={{ x: 0.1, y: 0, z: -0.3 }}
        />

        <text
          key="top_score"
          position={{ x: -0.15, y: 3.15, z: 0.25 }}
          scale={{ x: 0.3, y: 0.3, z: 0.3 }}
          value={this.getScore()}
          color="red"
          h-align="center"
        />

        <text
          key="bottom_score"
          position={{ x: 0.3, y: 1.2, z: 0.3 }}
          rotation={{ x: -50, y: 0, z: 0 }}
          scale={{ x: 0.2, y: 0.2, z: 0.2 }}
          value={this.getScore()}
          color="red"
          h-align="center"
        />

        <entity
          position={{ x: 0.1, y: 0.95, z: 0.1 }}
          rotation={{ x: -5, y: 0, z: 0 }}
        >
          <plane
            key={"1"}
            position={{ x: 0, y: 1, z: switched ? -0.1 : -0.3 }}
            material={{ src: src1, color: "white" }}
          />
          <plane
            key={"2"}
            position={{ x: 0, y: 1, z: !switched ? -0.1 : -0.3 }}
            material={{ src: src2, color: "white" }}
          />

          <Controls position={{ x: 0, y: 0, z: -0.05 }} />
        </entity>

        <gltf-model
          src="assets/restart.gltf"
          id="btn_retry"
          position={{ x: 0, y: 1.2, z: 0.2 }}
          scale={{ x: 0.2, y: 0.2, z: 0.2 }}
        />
      </scene>
    );
  }
}
