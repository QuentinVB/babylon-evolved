import Core from "../core";

/**
 * Define a state of the game (a simple state machine). Must be extended to fit the needs
 */
export default abstract class AbstractState {
  protected context: Core;
  constructor(context: Core) {
    this.context = context;
  }
  /**
   * Update the state, may replace the current state by another state using Next. 
   * This method will be registred by the level in the scene rendering loop usin registerBeforeRender() callback
   */
  public abstract Update(): void;
  /**
   * Manually trigger the update method, can be extended
   */
  public Trigger(): void {
    this.Update();
  }
  /**
   * Set the new state, called from update
   * @param newState the new state that will replace the current one (this)
   */
  protected Next(newState: AbstractState): void {
    this.context.level.gameState = newState;
  }
}