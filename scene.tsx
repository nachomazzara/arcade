import { createElement, ScriptableScene } from "metaverse-api";

export default class Arcade extends ScriptableScene<any> {
  async render() {
    return (
      <scene position={{ x: 5, y: 0, z: 5 }}>
        <system src="../machine/scene.js" position={{ x: -1, y: 0, z: 0 }} />
        <system src="../machine/scene.js" />
        <system src="../machine/scene.js" position={{ x: 1, y: 0, z: 0 }} />
      </scene>
    );
  }
}
