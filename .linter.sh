#!/bin/bash
cd /home/kavia/workspace/taskflow-pro-main-container-for-taskflow-pro-4951-4957/core_component_for_taskflow_pro
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

