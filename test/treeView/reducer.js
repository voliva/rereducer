import { compose, contains, equals, flatten, flip, inc, isNil, not, prop } from 'ramda';
import { combineReducers } from "redux";
import { concat, createReducer, fromAction, getState, innerReducer, reject, switchReducers } from "../../src";
import { ADD_CHILD, CREATE_NODE, DELETE_NODE, INCREMENT, REMOVE_CHILD } from "./actions";

const getNodeId = fromAction(['nodeId']);
const hasNodeId = compose(not, isNil, getNodeId);
const getChildId = fromAction(['childId']);
const getNode = createReducer([getNodeId, getState], prop);
const isChildId = compose(equals, getChildId);

const getAllTreeIds = (byId, node) => flatten([
    node.id,
    node.childIds.reduce((t, id) => [
        t,
        getAllTreeIds(byId, byId[id])
    ], [])
]);
const getAllTargetTreeIds = createReducer([getState, getNode], getAllTreeIds);
const containsIds = ids => compose(flip(contains)(ids), prop('id'));
const isInTargetId = compose(containsIds, getAllTargetTreeIds);

const deleteNode = reject(isInTargetId);
const concatChildId = concat(getChildId);
const rejectChildId = reject(isChildId);

const idReducer = switchReducers(
    null,
    [CREATE_NODE, getNodeId]
);
const counterReducer = switchReducers(
    0,
    [INCREMENT, inc]
);
const childIdsReducer = switchReducers(
    [],
    [ADD_CHILD, concatChildId],
    [REMOVE_CHILD, rejectChildId],
);

const childReducer = innerReducer([getNodeId], combineReducers({
    id: idReducer,
    counter: counterReducer,
    childIds: childIdsReducer
}));

export default switchReducers(
    {},
    [DELETE_NODE, deleteNode],
    [hasNodeId, childReducer]
);
